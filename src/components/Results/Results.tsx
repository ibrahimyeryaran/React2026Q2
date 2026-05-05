import { Component } from "react";
import type { ResultsProps } from "../../types";
import Card from "../Card/Card";
import styles from "./Results.module.css";

class Results extends Component<ResultsProps> {
  render() {
    const { items = [] } = this.props;
    return (
      <div>
        <h2 className={styles.title}>Results ({items.length})</h2>
        {items.length === 0 ? (
          <p className={styles.noResults}>
            No items found. Try searching for something!
          </p>
        ) : (
          <div className={styles.cardsList}>
            {items.map((item) => (
              <Card
                key={item.id}
                name={item.name}
                description={item.description}
                image={item.image}
                height={item.height}
                weight={item.weight}
                types={item.types}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Results;
